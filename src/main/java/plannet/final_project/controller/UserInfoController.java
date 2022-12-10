package plannet.final_project.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import plannet.final_project.service.UserInfoService;
import plannet.final_project.vo.MemberDTO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/user")
public class UserInfoController {
    private final UserInfoService userInfoService;
    public UserInfoController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    //사용자 정보 불러오기
    @PostMapping("/info_load")
    public ResponseEntity<List<Object>> userInfoLoad(@RequestBody Map<String, String> userId) {
        String id = userId.get("id");
        MemberDTO memberDTO = userInfoService.userInfo(id);
        if(memberDTO.isOk()) {
            List<Object> userInfo = new ArrayList<>();
            userInfo.add(memberDTO.getNickname());
            userInfo.add(memberDTO.getUserCode());
            userInfo.add(memberDTO.getProfile());
            userInfo.add(memberDTO.getEmail());
            userInfo.add(memberDTO.getTel());
            userInfo.add(memberDTO.getProImg());

            return new ResponseEntity(userInfo, HttpStatus.OK);
        } else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 사용자 정보 수정
    @PostMapping("/info_save")
    public ResponseEntity<Boolean> userInfoSave(@RequestBody Map<String, String> userInfo) {
        System.out.println("컨트롤러 핸드폰 : " + userInfo.get("phone"));
        System.out.println("컨트롤러 프로필 : " + userInfo.get("profile"));
        String id = userInfo.get("id");
        String nickname = userInfo.get("nickname");
        String phone = userInfo.get("phone");
        String profile = userInfo.get("profile");

        boolean result = userInfoService.saveUserInfo(id, nickname, phone, profile);
        if(result) {
            return new ResponseEntity(true, HttpStatus.OK);
        }
        else {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    // 사용자 프로필 이미지명 저장
    @PostMapping("/img_save")
    public ResponseEntity<Boolean> userImgSave(@RequestBody Map<String, String> userImg) {
        String id = userImg.get("id");
        String imgName = userImg.get("imgName");

        boolean result = userInfoService.saveUserImg(id, imgName);
        if(result) {
            return new ResponseEntity(true, HttpStatus.OK);
        }
        else {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    // nav바 정보 가져오기
    @PostMapping("/nav_info")
    public ResponseEntity<Map<String, Object>> NavInfo(@RequestBody Map<String, String> userId) {
        String id = userId.get("id");
        MemberDTO memberDTO1 = userInfoService.userInfo(id);
        MemberDTO memberDTO2 = userInfoService.navInfo(id);
        if(memberDTO1.isOk() && memberDTO2.isOk()) {
            Map<String, Object> navList = new HashMap<>();
            List<Object> userInfo = new ArrayList<>();
            userInfo.add(memberDTO1.getNickname());
            userInfo.add(memberDTO1.getUserCode());
            userInfo.add(memberDTO1.getProfile());
            userInfo.add(memberDTO1.getProImg());
            userInfo.add(memberDTO2.getPes());

            navList.put("userInfo", userInfo);
            navList.put("scalInfo", memberDTO2.getSCalList());

            return new ResponseEntity(navList, HttpStatus.OK);
        } else return new ResponseEntity(null, HttpStatus.OK);
    }
}