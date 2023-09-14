import { Color, SlideBody, SlideType } from "@turbo/api/src/models";
import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from ".";

export enum ModuleType {
  Assessment = 1,
  Video = 2,
  Presentation = 3,
}

export const TYPES = [
  {
    value: ModuleType.Assessment,
    label: "Assessment",
  },
  {
    value: ModuleType.Presentation,
    label: "Presentation",
  },
  {
    value: ModuleType.Video,
    label: "Video",
  },
];

export interface QuestionInput {
  prompt: string;
  options: string[];
  isMulti?: boolean;
  answers: [];
  translations: {
    [locale: string]: {
      prompt: string;
      options: string[];
    };
  };
}

export interface AssessmentModuleContentInput {
  questions: QuestionInput[];
  noOfRetries?: number;
  isRandom?: boolean;
  numberOfQuestions?: number;
  maxTime?: number;
}

export interface VideoModuleContentInput {
  video: string;
  provider?: string;
}

export interface SlideInput {
  title: string;
  backgroundColor?: Color;
  type: SlideType;
  body: SlideBody;

  translations: {
    [locale: string]: {
      title: string;
    };
  };
}

export interface PresentationModuleContentInput {
  module: Module;
  slides: SlideInput[];
}

export interface ModuleInput {
  name: string;
  description: string;
  duration: number;
  thumbnailImage?: string;
  coverImage?: string;
  tenant?: string;
  type: ModuleType;
  content?:
    | VideoModuleContentInput
    | AssessmentModuleContentInput
    | PresentationModuleContentInput;
}

export interface Module extends ModuleInput {
  id: string;
}

export type ModulesResponse = PaginatedResponse<Module[]>;
export type ModuleResponse = Response<Module>;

export const modules = async (
  params: PaginatedParams,
  tenant?: string
): Promise<ModulesResponse> => {
  var body = tenant ? { tenant } : undefined;
  return (await axios.post(paginatedUrl(`/admin/modules/filter`, params), body))
    .data;
};

export const modulesQuery = (
  params: PaginatedParams = { skip: 0, take: 10 },
  tenant?: string
) => ({
  queryKey: [...generatePaginatedQueryKey(["modules"], params), tenant],
  queryFn: async () => await modules(params, tenant),
  keepPreviousData: true,
});

export type ModuleNamesResponse = PaginatedResponse<
  {
    id: string;
    name: string;
    type: string;
    thumbnailImage: string;
  }[]
>;

export const moduleNames = async (
  params: PaginatedParams
): Promise<ModuleNamesResponse> => {
  return (await axios.get(paginatedUrl(`/admin/modules/names`, params))).data;
};

export const moduleNamesQuery = (
  params: PaginatedParams = { skip: 0, take: 100 }
) => ({
  queryKey: generatePaginatedQueryKey(["module-names"], params),
  queryFn: async () => await moduleNames(params),
});

export const moduleNamesForTenant = async (
  params: PaginatedParams,
  tenant: string,
  tenantOnly: boolean
): Promise<ModuleNamesResponse> => {
  return (
    await axios.post(
      paginatedUrl(`/admin/tenants/${tenant}/modules/names`, params),
      { tenantOnly }
    )
  ).data;
};

export const moduleNamesForTenantQuery = (
  params: PaginatedParams = { skip: 0, take: 100 },
  tenant: string,
  tenantOnly: boolean
) => ({
  queryKey: [
    ...generatePaginatedQueryKey(["module-names-tenant"], params),
    tenant,
    tenantOnly,
  ],
  queryFn: async () => await moduleNamesForTenant(params, tenant, tenantOnly),
});

export const module = async (id: string): Promise<ModuleResponse> => {
  return (await axios.get(`/admin/modules/${id}`)).data;
};

export const moduleQuery = (id: string, enabled = true) => ({
  queryKey: ["module", id],
  queryFn: async () => await module(id),
  enabled,
});

export const createModule = async (params: ModuleInput): Promise<Response> => {
  return (await axios.post("/admin/modules", params)).data;
};

export const editModule = async (
  id: string,
  params: Partial<ModuleInput>
): Promise<Response> => {
  return (await axios.put(`/admin/modules/${id}`, params)).data;
};

export const deleteModule = async (id: string): Promise<Response> => {
  return (await axios.delete(`/admin/modules/${id}`)).data;
};
