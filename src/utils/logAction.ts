import { MethodsHTTP } from "@prisma/client";

import { prisma } from "../prisma/prisma-client";

export const logAction = async (
  userId: string,
  action: string,
  methodHTTP: MethodsHTTP
) => {
  await prisma.log.create({
    data: {
      userId,
      action,
      methodHTTP,
    },
  });
};
