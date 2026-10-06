package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    
    private Long id;
    
    @NotBlank(message = "Mã vật tư không được để trống")
    @Size(max = 30, message = "Mã vật tư không được vượt quá 30 ký tự")
    private String code;
    
    @NotBlank(message = "Tên vật tư không được để trống")
    @Size(max = 200, message = "Tên vật tư không được vượt quá 200 ký tự")
    private String name;
    
    @NotBlank(message = "Đơn vị tính không được để trống")
    @Size(max = 20, message = "Đơn vị tính không được vượt quá 20 ký tự")
    private String unit;
    
    @Size(max = 100, message = "Nhà sản xuất không được vượt quá 100 ký tự")
    private String manufacturer;
    
    @NotBlank(message = "Loại vật tư không được để trống")
    @Size(max = 30, message = "Loại vật tư không được vượt quá 30 ký tự")
    private String category;
    
    private Integer totalStock;
}
