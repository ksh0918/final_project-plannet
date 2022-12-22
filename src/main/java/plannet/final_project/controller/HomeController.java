package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping("/personal")
    public ResponseEntity<Map<String, Object>> personalHome(@RequestBody Map<String, String> data) {
        String id = data.get("id");
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