package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.ScalService;
import plannet.final_project.vo.ShareDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/scal")
@RequiredArgsConstructor
public class ScalController {
    // Service 로직 연결
    private final ScalService scalService;

    // 해당 캘린더의 각 정보 불러오기
    @GetMapping("/sharing")
    public ResponseEntity<List<Map<String, Object>>> sharingHome(@RequestParam Long calNo) {
        Map<String, Object> sharingHome = new HashMap<>();
        ShareDTO shareDTO = scalService.homeList(calNo);
        if(shareDTO.isOk()) {
            sharingHome.put("calName", shareDTO.getCalName());
            sharingHome.put("list", shareDTO.getWeekPlan());
            sharingHome.put("planMark", shareDTO.getPlanMark());
            sharingHome.put("memo", shareDTO.getMemo());
            sharingHome.put("memberList", shareDTO.getMemberList());
            return new ResponseEntity(sharingHome, HttpStatus.OK);
        } else {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 메모 불러오기
    @PostMapping("/memo")
    public ResponseEntity<Boolean> memoWrite(@RequestBody Map<String, String> calMemo) {
        Long calNo = Long.parseLong(calMemo.get("calNo"));
        String detail = calMemo.get("detail");
        System.out.println(calNo);
        System.out.println(detail);
        boolean memoWrite = scalService.memoWrite(calNo, detail);
        if(memoWrite) return new ResponseEntity(memoWrite, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }
}
