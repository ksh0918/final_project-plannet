package plannet.final_project.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import plannet.final_project.config.ConfigUtils;
import plannet.final_project.dto.GoogleLoginDto;
import plannet.final_project.dto.GoogleLoginRequest;
import plannet.final_project.dto.GoogleLoginResponse;
import plannet.final_project.service.MemberService;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Controller
@RequestMapping(value = "/google")
@RequiredArgsConstructor
public class GoogleController {
    private final ConfigUtils configUtils;
    private final MemberService memberService;

    @GetMapping(value = "/login")
    public ResponseEntity<Object> moveGoogleInitUrl() {
        String authUrl = configUtils.googleInitUrl();
        URI redirectUri;
        try {
            redirectUri = new URI(authUrl);
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setLocation(redirectUri);
            return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping(value = "/login/redirect")
    public String redirectGoogleLogin(@RequestParam(value = "code") String authCode) {
        // HTTP 통신을 위해 RestTemplate 활용
        RestTemplate restTemplate = new RestTemplate();
        GoogleLoginRequest requestParams = GoogleLoginRequest.builder()
            .clientId(configUtils.getGoogleClientId())
            .clientSecret(configUtils.getGoogleSecret())
            .code(authCode)
            .redirectUri(configUtils.getGoogleRedirectUri())
            .grantType("authorization_code")
            .build();
        log.info("Request Parameters = {}", requestParams.toString());
        try {
            // Http Header 설정 -클라이언트와 서버가 요청 또는 응답으로 부가적인 정보를 전송할 수 있도록 함
            HttpHeaders headers = new HttpHeaders();
            // 컨텐트 타입을 APPLICATION JSON 으로 설정
            headers.setContentType(MediaType.APPLICATION_JSON);
            // RequestEntity<T>의 상위 클래스 - HTTP 요청 또는 응답에 해당하는 HttpHeader와 HttpBody를 포함하는 클래스,
            HttpEntity<GoogleLoginRequest> httpRequestEntity = new HttpEntity<>(requestParams, headers);
            ResponseEntity<String> apiResponseJson = restTemplate.postForEntity(configUtils.getGoogleAuthUrl() + "/token", httpRequestEntity, String.class);

            // ObjectMapper를 통해 String to Object로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
            objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // NULL이 아닌 값만 응답받기 (NULL인 경우는 생략)
            GoogleLoginResponse googleLoginResponse = objectMapper.readValue(apiResponseJson.getBody(), new TypeReference<>() {});

            // 사용자의 정보는 JWT Token으로 저장되어 있고, Id_Token에 값을 저장한다.
            String jwtToken = googleLoginResponse.getIdToken();
            log.info("GoogleLoginResponse");
            log.info("AccessToken = {}", googleLoginResponse.getAccessToken());
            log.info("IdToken(AccessToken) = {}", googleLoginResponse.getIdToken());

            // JWT Token을 전달해 JWT 저장된 사용자 정보 확인
            String requestUrl = UriComponentsBuilder.fromHttpUrl(configUtils.getGoogleAuthUrl() + "/tokeninfo").queryParam("id_token", jwtToken).toUriString();
            String resultJson = restTemplate.getForObject(requestUrl, String.class);

            if(resultJson != null) {
                GoogleLoginDto userInfoDto = objectMapper.readValue(resultJson, new TypeReference<>() {});
                String email = userInfoDto.getEmail();
                String id = userInfoDto.getSub();
                String name = userInfoDto.getName();
                int regStatus = memberService.googleLoginReg(email);

                // return "redirect:"+ UriComponentsBuilder.fromUriString("http://15.165.75.129:8111/social")
                return "redirect:"+ UriComponentsBuilder.fromUriString("http://localhost:8111/social")
                    .queryParam("id", id)
                    .queryParam("name", name)
                    .queryParam("email", email)
                    .queryParam("regStatus", regStatus) // 구글로 가입된 회원은 0 , 일반 회원은 1, 첫 구글로그인 2
                    .build()
                    .encode(StandardCharsets.UTF_8);
            }
            else {throw new Exception("Google OAuth failed!");}
        }
        catch (Exception e) {e.printStackTrace();}

        // return "redirect:"+ UriComponentsBuilder.fromUriString("http://15.165.75.129:8111/social")
        return "redirect:"+ UriComponentsBuilder.fromUriString("http://localhost:8111/social")
            .queryParam("regStatus", "3") //오류시 3을 보냄
            .build();
    }
}