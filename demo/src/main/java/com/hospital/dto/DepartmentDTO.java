package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {

    private Long id;

    @NotBlank(message = "Mã khoa/phòng không được để trống")
    @Size(max = 30, message = "Mã khoa/phòng không được vượt quá 30 ký tự")
    private String code;

    @NotBlank(message = "Tên khoa/phòng không được để trống")
    @Size(max = 200, message = "Tên khoa/phòng không được vượt quá 200 ký tự")
    private String name;

    @Size(max = 15, message = "Số điện thoại không được vượt quá 15 ký tự")
    private String phoneNumber;

    private Long headUserId;
    private String headUserName;
}
