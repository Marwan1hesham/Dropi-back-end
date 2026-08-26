import z from "zod";
import { statusEnum } from "../../common/enum/product.enum";

export const addProductSchema = {
  body: {
    stock: z.number().min(1).max(100),
    category: z.string(),
    status: z.enum(statusEnum).default(statusEnum.new),
    discount: z.number().min(1).max(100),
    price: z.number().min(1).max(10000),
    name: z.string(),
  },
  file: {
    attachment: z.string(),
  },
  files: {
    attachments: z.array(z.string()),
  },
};
