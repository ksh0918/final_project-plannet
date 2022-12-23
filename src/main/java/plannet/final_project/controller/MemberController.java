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
    public ResponseEntity<Boolean> memberLogin(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String pwd = data.get("pwd");
        String result = memberService.loginCheck(id,pwd);
        switch (result) {
            case "google" : return new ResponseEntity("google", HttpStatus.OK);
            case "normal" : return new ResponseEntity("normal", HttpStatus.OK);
            default : return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 구글 연동 시 메일에서 아이디를 찾아옴
    @GetMapping("/social_login_find_id")
    public ResponseEntity<String> socialLoginFindId(@RequestParam String email) {
        String userId = "userID:" + memberService.socialLoginFindId(email);
        if(!userId.equals("NOK")) return new ResponseEntity(userId,HttpStatus.OK);
        else return new ResponseEntity("NOK",HttpStatus.OK);
    }

    // 처음 구글 로그인 한 사람 회원가입
    @PostMapping("/new_social_save")
    public ResponseEntity<Boolean> newSocialSave(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String name = data.get("name");
        String email = data.get("email");
        String nickname = data.get("nickname");
        String tel = data.get("tel");
        boolean result = memberService.newSocialSave(id, name, email, nickname, tel);
        if(result) return new ResponseEntity(true,HttpStatus.OK);
        else return new ResponseEntity(false,HttpStatus.OK);
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> memberRegister(@RequestBody Map<String, String> data) {
        try {
            String id = data.get("id");
            String pwd = data.get("pwd");
            String name = data.get("name");
            String nickname = data.get("nickname");
            String email = data.get("email");
            String tel = data.get("tel");
            String optIn = data.get("optInResult");
            boolean result = memberService.memberReg(id, pwd, name, nickname, email, tel, optIn);
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
    public ResponseEntity<Boolean> overlapCheck(@RequestBody Map<String, String> data){
        try {
            String keyword = data.get("keyword");
            String type = data.get("type");
            boolean result = memberService.overlapCheck(keyword, type);
            if(result) return new ResponseEntity(true, HttpStatus.OK);
            else return new ResponseEntity(false, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    // 아이디 비밀번호 찾기
    @GetMapping("/find")
    public ResponseEntity<List<MemberDTO>> memberFind(@RequestParam String keyword, String email, String type) {
        MemberDTO memDTO = memberService.memberFind(keyword, email, type);
        if(memDTO.isOk()) return new ResponseEntity(memDTO, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }

    // 비밀번호 찾기 시 새 비밀번호 설정
    @PostMapping("/new_pwd")
    public ResponseEntity<Boolean> newPwd(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String pwd = data.get("pwd");
        boolean result = memberService.newPwd(id, pwd);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }

    // 회원 탈퇴
    @PostMapping("/delete")
    public ResponseEntity<Boolean> memberDelete(@RequestBody Map<String,String> data){
        String id = data.get("id");
        boolean member = memberService.memberDelete(id);
        if(member)return new ResponseEntity(true,HttpStatus.OK);
        else return new ResponseEntity(false,HttpStatus.OK);
    }

    // 구글 계정으로 연동 (기존 gmail 가입 회원이)
    @PostMapping("/change_social_login")
    public ResponseEntity<String> changeSocialLogin(@RequestBody Map<String,String> data) {
        String email = data.get("email");
        String userId = "userID:" + memberService.changeSocialLogin(email);
        if(!userId.equals("NOK")) return new ResponseEntity(userId,HttpStatus.OK);
        else return new ResponseEntity("NOK",HttpStatus.OK);
    }
}