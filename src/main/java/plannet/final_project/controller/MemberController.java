package plannet.final_project.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.EmailService;
import plannet.final_project.service.MemberService;
import plannet.final_project.vo.MemberDTO;

import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/member")
public class MemberController {
    private MemberService memberService;
    private EmailService emailService;
    public MemberController(MemberService memberService){
        this.memberService = memberService;
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> memberLogin(@RequestBody Map<String, String> loginData){
        String id = loginData.get("id");
        String pwd = loginData.get("pwd");
        boolean result = memberService.loginCheck(id,pwd);
        if(result){
            return new ResponseEntity(true, HttpStatus.OK);
        }
        else{
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> registerMember(@RequestBody Map<String, String> regData) {
        try{
            String id = regData.get("id");
            String pwd = regData.get("pwd");
            String name = regData.get("name");
            String nickname = regData.get("nickname");
            String email = regData.get("email");
            String tel =regData.get("tel");
            boolean result = memberService.regMember(id, pwd, name, nickname, email, tel);
            log.warn(String.valueOf(result));
            if(result){
                return new ResponseEntity(true, HttpStatus.OK);
            }
            else {
                log.warn("값이 false");
                return new ResponseEntity(false, HttpStatus.OK);
            }
        }catch (Exception e){
            log.warn("Controll오류");
            return new ResponseEntity(false, HttpStatus.OK);
        }

    }

    @PostMapping("/overlap_check")
    public ResponseEntity<Boolean> overlapCheck(@RequestBody Map<String, String> checkData){
        try{
            String uni = checkData.get("uni");
            String type = checkData.get("type");

            boolean result = memberService.overlapCheck(uni, type);
            if(result){
                return new ResponseEntity(true, HttpStatus.OK);
            }
            else {
                return new ResponseEntity(false, HttpStatus.OK);
            }
        } catch (Exception e) {
            return  new ResponseEntity(false, HttpStatus.OK);
        }
    }
    // 아이디 비밀번호 찾기
    @PostMapping("/find_check")
    public ResponseEntity<List<MemberDTO>> memberFind(@RequestBody Map<String, String> memFind) {
        String uni = memFind.get("uni");
        String email = memFind.get("email");
        String type = memFind.get("type");

        MemberDTO memberDTO = memberService.memberFindCheck(uni, email, type);
        if(memberDTO.isOk()) return new ResponseEntity(memberDTO, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }
    // 비밀번호 찾기 시 새 비밀번호 설정
    @PostMapping("/new_pwd")
    public ResponseEntity<Boolean> memberNewPwd(@RequestBody Map<String, String> newPwd) {
        String id = newPwd.get("id");
        String pwd = newPwd.get("pwd");

        boolean result = memberService.regNewPwd(id, pwd);
        if(result) {
            return new ResponseEntity(true, HttpStatus.OK);
        }
        else {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }
    @PostMapping("/member_delete")
    public ResponseEntity<Boolean> memberDelete(@RequestBody Map<String,String> delete){
        String id = delete.get("id");
        boolean member = memberService.deleteMember(id);
        if(member){
            return new ResponseEntity(true,HttpStatus.OK);
        }
        else{
            return new ResponseEntity(false,HttpStatus.OK);
        }
    }
    @PostMapping("/emailConfirm")
    public String emailConfirm(@RequestParam(value = "email",required =false) String email ) throws Exception {

        String confirm = emailService.sendSimpleMessage(email);

        return confirm;
    }
}