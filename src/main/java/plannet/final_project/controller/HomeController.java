package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.HomeService;
import plannet.final_project.vo.HomeDTO;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeController {
    private final HomeService homeService;

    // 개인 home/달력/주간일정/메모/명언 출력하기
    @GetMapping("/personal")
    public ResponseEntity<Map<String, Object>> personalHome(@RequestParam String id) {
        Map<String, Object> personalHome = new HashMap<>();
        HomeDTO homeDTO = homeService.homeList(id);
        if(homeDTO.isOk()) {
            personalHome.put("list", homeDTO.getWeekPlan());
            personalHome.put("planMark", homeDTO.getPlanMark());
            personalHome.put("memo", homeDTO.getMemo());
            personalHome.put("quote", homeDTO.getQuote());
            log.warn(String.valueOf(personalHome));
            return new ResponseEntity(personalHome, HttpStatus.OK);
        } else {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }
    // 회원 메모 저장하기
    @PostMapping("/memo")
    public ResponseEntity<Boolean> memoWrite(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String detail = data.get("detail");
        System.out.println(id);
        System.out.println(detail);
        boolean memoWrite = homeService.memoWrite(id, detail);
        if(memoWrite) return new ResponseEntity(memoWrite, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }
}