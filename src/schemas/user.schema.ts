import * as v from "valibot";
import { isMobilePhone, isNumeric } from "validator";

export const createUserSchema = v.object({
  firstName: v.string("Tidak valid", [v.minLength(1, "Tidak boleh kosong")]),
  lastName: v.string("Tidak valid"),
  email: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.email("Format email salah"),
  ]),
  phoneNumber: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.custom(isMobilePhone, "Format nomor telepon salah"),
  ]),
  password: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.minLength(8, "Minimal 8 karakter"),
  ]),
  nik: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.maxLength(16, "Format NIK salah"),
    v.custom(isNumeric, "Format NIK salah"),
  ]),
  major: v.string("Tidak valid", [v.minLength(1, "Tidak boleh kosong")]),
});
