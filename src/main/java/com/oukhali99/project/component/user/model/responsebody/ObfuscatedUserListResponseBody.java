package com.oukhali99.project.component.user.model.responsebody;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.model.ObfuscatedUser;
import com.oukhali99.project.model.responsebody.ErrorCode;
import com.oukhali99.project.model.responsebody.MyMessageResponseBody;

import java.util.LinkedList;
import java.util.List;

public class ObfuscatedUserListResponseBody extends MyMessageResponseBody {

    private List<ObfuscatedUser> obfuscatedUserList;

    public ObfuscatedUserListResponseBody(String message, List<User> userList) {
        super(ErrorCode.SUCCESS, message);

        obfuscatedUserList = new LinkedList<>();
        for (User user : userList) {
            obfuscatedUserList.add(new ObfuscatedUser(user));
        }
    }

    public ObfuscatedUserListResponseBody(String message, List<User> userList, User selfUser) {
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
