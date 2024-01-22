package com.oukhali99.project.component.user.model.responsebody;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.model.ObfuscatedUser;
import com.oukhali99.project.model.apiresponse.ErrorCode;
import com.oukhali99.project.model.apiresponse.ApiMessageResponse;

import java.util.LinkedList;
import java.util.List;

public class ObfuscatedUserListResponse extends ApiMessageResponse {

    private List<ObfuscatedUser> obfuscatedUserList;

    public ObfuscatedUserListResponse(String message, List<User> userList) {
        super(ErrorCode.SUCCESS, message);

        obfuscatedUserList = new LinkedList<>();
        for (User user : userList) {
            obfuscatedUserList.add(new ObfuscatedUser(user));
        }
    }

    public ObfuscatedUserListResponse(String message, List<User> userList, User selfUser) {
        super(ErrorCode.SUCCESS, message);

        obfuscatedUserList = new LinkedList<>();
        for (User user : userList) {
            obfuscatedUserList.add(new ObfuscatedUser(user, selfUser));
        }
    }

    public List<ObfuscatedUser> getObfuscatedUserList() {
        return obfuscatedUserList;
    }

}
