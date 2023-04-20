export function validateDepartment(department: string) {
  return {
    $elemMatch: {
      $and: [
        { $or: [{ department }, { department: "All" }] },
        {
          $or: [
            {
              deadline: { $gt: new Date() },
            },
            {
              deadline: { $exists: false },
            },
          ],
        },
      ],
    },
  };
}
