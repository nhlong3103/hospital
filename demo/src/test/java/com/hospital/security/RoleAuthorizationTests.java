package com.hospital.security;

import com.hospital.entity.User;
import com.hospital.enums.AccountStatus;
import com.hospital.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RoleAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    private RequestPostProcessor loginAs(UserRole role) {
        User user = new User();
        user.setId(999L);
        user.setFullName("Test User");
        user.setEmail("test@hospital.vn");
        user.setPassword("not-used");
        user.setRole(role);
        user.setStatus(AccountStatus.ACTIVE);

        CustomUserDetails principal = new CustomUserDetails(user);
        return authentication(new UsernamePasswordAuthenticationToken(
            principal, null, principal.getAuthorities()));
    }

    @Test
    void unauthenticatedRequestIsRejectedWith401() throws Exception {
        mockMvc.perform(request(HttpMethod.GET, "/api/v1/materials"))
            .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest(name = "{0} {1} {2} -> 403")
    @CsvSource({
        "DEPARTMENT_STAFF,   POST,   /api/v1/requisitions/1/verify",
        "WAREHOUSE_KEEPER,   POST,   /api/v1/requisitions/1/approve",
        "DEPARTMENT_STAFF,   POST,   /api/v1/requisitions/1/approve",
        "DEPARTMENT_HEAD,    POST,   /api/v1/requisitions/1/issue",
        "ACCOUNTANT,         POST,   /api/v1/requisitions/1/submit",
        "WAREHOUSE_KEEPER,   POST,   /api/v1/goods-receipts/1/verify-invoice",
        "ACCOUNTANT,         POST,   /api/v1/goods-receipts/1/finalize",
        "WAREHOUSE_KEEPER,   POST,   /api/v1/goods-receipts/1/finalize",
        "ACCOUNTANT,         POST,   /api/v1/goods-receipts/1/confirm-received",
        "DEPARTMENT_STAFF,   GET,    /api/v1/goods-receipts",
        "WAREHOUSE_KEEPER,   GET,    /api/v1/goods-receipts/1/payment-request",
        "WAREHOUSE_KEEPER,   POST,   /api/v1/purchase-plans/1/approve",
        "WAREHOUSE_MANAGER,  POST,   /api/v1/purchase-plans/1/place-order",
        "WAREHOUSE_MANAGER,  POST,   /api/v1/purchase-plans/1/submit",
        "ACCOUNTANT,         GET,    /api/v1/purchase-plans",
        "WAREHOUSE_KEEPER,   GET,    /api/v1/users",
        "DEPARTMENT_HEAD,    GET,    /api/v1/users",
        "WAREHOUSE_KEEPER,   DELETE, /api/v1/materials/1",
        "ACCOUNTANT,         DELETE, /api/v1/suppliers/1",
        "WAREHOUSE_KEEPER,   DELETE, /api/v1/departments/1",
        "DEPARTMENT_STAFF,   PATCH,  /api/v1/stocks/1/location?location=A1"
    })
    void wrongRoleIsForbidden(String role, String method, String url) throws Exception {
        mockMvc.perform(request(HttpMethod.valueOf(method), url).with(loginAs(UserRole.valueOf(role))))
            .andExpect(status().isForbidden());
    }

    @Test
    void userCannotChangeAnotherUsersPassword() throws Exception {
        mockMvc.perform(request(HttpMethod.POST, "/api/v1/users/1/change-password")
                .param("oldPassword", "x")
                .param("newPassword", "yyyyyy")
                .with(loginAs(UserRole.WAREHOUSE_KEEPER)))
            .andExpect(status().isForbidden());
    }

    @Test
    void departmentListIsReturnedAsValidJson() throws Exception {
        mockMvc.perform(request(HttpMethod.GET, "/api/v1/departments")
                .with(loginAs(UserRole.ADMIN)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void allowedRoleCanReadMaterials() throws Exception {
        mockMvc.perform(request(HttpMethod.GET, "/api/v1/materials")
                .with(loginAs(UserRole.DEPARTMENT_STAFF)))
            .andExpect(status().isOk());
    }
}
