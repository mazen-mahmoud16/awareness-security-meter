import { Admin } from "../models/admin";
import { Module } from "../models/module";
import { ModuleSession } from "../models/module/session";
import { Program } from "../models/program";
import { ProgramSession } from "../models/program/session";
import { User as MyUser } from "../models/user";

declare global {
  namespace Express {
    export interface User extends MyUser {}
    export interface Request {
      admin: Admin;
      user: MyUser;
      imageUrl?: string;
      videoUrl?: string;
      module: Module;
      moduleSession: ModuleSession;
      program: Program;
      programSession: ProgramSession;
    }
  }
}

declare module "express-session" {
  export interface Session {
    user: string;
    admin: string;
  }
}
