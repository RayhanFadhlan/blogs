import {  ParseFilePipeBuilder, UploadedFile } from "@nestjs/common";

export function ValidateImageFile() {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^image\/(jpeg|png|gif|webp)$/,
      })
      .addMaxSizeValidator({
        maxSize: 1024 * 1024 * 10, // 10MB
      })
      .build({
        fileIsRequired: false,
      }),
  );
}