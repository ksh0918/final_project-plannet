package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.MemberService;
import plannet.final_project.vo.MemberDTO;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // 구글연동 계정인지, 일반계정인지 체크
     @PostMapping("/login")
    public ResponseEntity<Boolean> memberLogin(@RequestBody Map<String, String> loginData) {
        String id = loginData.get("id");
        String pwd = loginData.get("pwd");
        String result = memberService.loginCheck(id,pwd);
        switch (result) {
            case "google" : return new ResponseEntity("google", HttpStatus.OK);
            case "normal" : return new ResponseEntity("normal", HttpStatus.OK);
            default : return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 구글 연동 시 메일에서 아이디를 찾아옴
    @PostMapping("/social_login_find_id")
    public ResponseEntity<String> socialLoginFindId(@RequestBody Map<String,String> change) {
        String email = change.get("email");
        String userId = "userID:" + memberService.socialLoginFindId(email);
        if(!userId.equals("NOK")) return new ResponseEntity(userId,HttpStatus.OK);
        else return new ResponseEntity("NOK",HttpStatus.OK);
    }

    // 처음 구글 로그인 한 사람 회원가입
    @PostMapping("/new_social_save")
    public ResponseEntity<Boolean> newSocialSave(@RequestBody Map<String,String> save) {
        String id = save.get("id");
        String name = save.get("name");
        String nickname = save.get("nickname");
        String email = save.get("email");
        String tel = save.get("tel");
        boolean result = memberService.newSocialSave(id, name, nickname, email, tel);
        if(result) return new ResponseEntity(true,HttpStatus.OK);
        else return new ResponseEntity(false,HttpStatus.OK);
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> memberRegister(@RequestBody Map<String, String> regData) {
        try {
            String id = regData.get("id");
            String pwd = regData.get("pwd");
            String name = regData.get("name");
            String nickname = regData.get("nickname");
            String email = regData.get("email");
            String tel =regData.get("tel");
            boolean result = memberService.memberReg(id, pwd, name, nickname, email, tel);
            log.warn(String.valueOf(result));
            if(result) return new ResponseEntity(true, HttpStatus.OK);
            else {
                log.warn("값이 false");
                return new ResponseEntity(false, HttpStatus.OK);
            }
        } catch (Exception e){
            log.warn("Controll오류");
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    // 아이디, 이메일, 전화번호, 닉네임 중복체크
    @PostMapping("/overlap_check")
    public ResponseEntity<Boolean> overlapCheck(@RequestBody Map<String, String> checkData){
        try {
            String keyword = checkData.get("keyword");
            String type = checkData.get("type");
            boolean result = memberService.overlapCheck(keyword, type);
            if(result) return new ResponseEntity(true, HttpStatus.OK);
            else return new ResponseEntity(false, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    // 아이디 비밀번호 찾기
    @PostMapping("/find")
    public ResponseEntity<List<MemberDTO>> memberFind(@RequestBody Map<String, String> memFind) {
        String keyword = memFind.get("keyword");
        String type = memFind.get("type");
        String email = memFind.get("email");
        MemberDTO memDTO = memberService.memberFind(keyword, type, email);
        if(memDTO.isOk()) return new ResponseEntity(memDTO, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }

    // 비밀번호 찾기 시 새 비밀번호 설정
    @PostMapping("/new_pwd")
    public ResponseEntity<Boolean> newPwd(@RequestBody Map<String, String> newPwd) {
        String id = newPwd.get("id");
        String pwd = newPwd.get("pwd");
        boolean result = memberService.newPwd(id, pwd);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }

    // 회원 탈퇴
    @PostMapping("/delete")
    public ResponseEntity<Boolean> memberDelete(@RequestBody Map<String,String> delete){
        String id = delete.get("id");
        boolean member = memberService.memberDelete(id);
        if(member)return new ResponseEntity(true,HttpStatus.OK);
        else return new ResponseEntity(false,HttpStatus.OK);
    }

    // 구글 계정으로 연동 (기존 gmail 가입 회원이)
    @PostMapping("/change_social_login")
    public ResponseEntity<String> changeSocialLogin(@RequestBody Map<String,String> change) {
        String email = change.get("email");
        String userId = memberService.changeSocialLogin(email);
        if(!userId.equals("NOK")) return new ResponseEntity(userId,HttpStatus.OK);
        else return new ResponseEntity("NOK",HttpStatus.OK);
    }
}