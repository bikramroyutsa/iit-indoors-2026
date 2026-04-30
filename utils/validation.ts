import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long").trim(),
  batch: z.string().min(1, "Batch is required").trim(),
  bsse_roll: z.string().min(1, "Roll number is required").max(15, "Roll number is too long").trim(),
  mail: z.string().email("Invalid email address").trim(),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be exactly 11 digits").trim(),
  paymentMethod: z.enum(["bkash", "nagad"], { error: "Please select a payment method" }),
  transactionId: z.string().min(1, "Transaction ID is required").max(100, "Transaction ID is too long").trim(),
  selectedGames: z.array(z.number()).min(1, "Please select at least one game"),
  teammates: z.record(z.string(), z.array(z.string().trim().max(100, "Teammate name is too long"))),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
