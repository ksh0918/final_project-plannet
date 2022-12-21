package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import plannet.final_project.dto.EmailAuthRequestDto;
import plannet.final_project.service.EmailService;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;
    @PostMapping("login/mailConfirm")
    public String mailConfirm(@RequestBody EmailAuthRequestDto emailDto) throws MessagingException, UnsupportedEncodingException, UnsupportedEncodingException {
        String authCode = emailService.sendEmail(emailDto.getEmail());
        return authCode;
    }
}