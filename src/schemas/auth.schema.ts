import * as v from "valibot";
import { isMobilePhone, isNumeric } from "validator";

export const loginSchema = v.object({
  emailOrPhoneNumber: v.union([
    v.string("Tidak valid", [
      v.minLength(1, "Tidak boleh kosong"),
      v.email("Format email salah"),
    ]),
    v.string("Tidak valid", [
      v.minLength(1, "Tidak boleh kosong"),
      v.custom(isMobilePhone, "Format nomor telepon salah"),
    ]),
  ]),
  password: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.minLength(8, "Minimal 8 karakter"),
  ]),
});

export const verifyParamSchema = v.object({
  nik: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.maxLength(16, "Format NIK salah"),
    v.custom(isNumeric, "Format NIK salah"),
  ]),
});

export const verifyBodySchema = v.object({
  code: v.string("Tidak valid", [
    v.minLength(1, "Tidak boleh kosong"),
    v.maxLength(6, "Format kode verifikasi salah"),
    v.custom(isNumeric, "Format kode verifikasi salah"),
  ]),
});
