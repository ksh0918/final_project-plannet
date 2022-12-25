package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.UserInfoService;
import plannet.final_project.vo.MemberDTO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserInfoController {
    private final UserInfoService userInfoService;

    // 사용자 정보 불러오기
    @GetMapping("/info_load")
    public ResponseEntity<List<Object>> userInfoLoad(@RequestParam String id) {
        MemberDTO memberDTO = userInfoService.userInfoLoad(id);
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

    // 사용자 정보 수정하기
    @PostMapping("/info_save")
    public ResponseEntity<Boolean> userInfoSave(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String nickname = data.get("nickname");
        String tel = data.get("tel");
        String profile = data.get("profile");
        boolean result = userInfoService.userInfoSave(id, nickname, tel, profile);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }

    // 사용자 프로필 이미지명 저장
    @PostMapping("/img_save")
    public ResponseEntity<Boolean> userImgSave(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String imgName = data.get("imgName");
        boolean result = userInfoService.saveUserImg(id, imgName);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }

    // Nav바 정보 불러오기
    @GetMapping("/nav_info")
    public ResponseEntity<Map<String, Object>> NavInfo(@RequestParam String id) {
        MemberDTO memberDTO1 = userInfoService.userInfoLoad(id);
        MemberDTO memberDTO2 = userInfoService.navInfoLoad(id);
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