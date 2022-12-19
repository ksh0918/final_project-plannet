package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.ScalService;
import plannet.final_project.vo.ShareDTO;

import java.time.LocalDate;
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

    // 메모 불러오기 & 수정
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

    // 공유캘린더 일정 불러오기
    @PostMapping("/plan_load")
    public ResponseEntity<List<ShareDTO>> planLoad(@RequestBody Map<String, String> planLoad) {
        Long calNo = Long.valueOf(planLoad.get("calNo"));
        LocalDate date = LocalDate.parse(planLoad.get("date"));
        ShareDTO shareDTO = scalService.planLoad(calNo, date);
        if (shareDTO.isOk()) {
            return new ResponseEntity(shareDTO.getPlanList(), HttpStatus.OK);
        } else {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

//    // 공유캘린더 일정 작성하기
//    @PostMapping("/plan_save")
//    public ResponseEntity<Boolean> writeSave(@RequestBody Map<String, Object> scalWrSave) {
//        String userId = (String)scalWrSave.get("id");
//        LocalDate date = LocalDate.parse((String)scalWrSave.get("date"));
//        List<Map<String, Object>> plan = (List<Map<String, Object>>)scalWrSave.get("plan");
//
//        boolean result = writeService.writeSave(userId, date, plan, diary);
//        if(result) {
//            return new ResponseEntity(true, HttpStatus.OK);
//        } else {
//            return new ResponseEntity(false, HttpStatus.OK);
//        }
//    }

    // 공유캘린더 댓글 불러오기
    @PostMapping("/comments_load")
    public ResponseEntity<List<Map<String, Object>>> commentsLoad(@RequestBody Map<String, String> commentsLoad) {
        System.out.println("1111111111111111111111111111111111111111111111111111111");
        Long calNo = Long.valueOf(commentsLoad.get("calNo"));
        LocalDate planDate = LocalDate.parse(commentsLoad.get("date"));
        ShareDTO shareDTO = scalService.getCommentsLoad(calNo, planDate);
        System.out.println("scalService");
        if(shareDTO.isOk()) {
            List<Map<String, Object>> commentsList = shareDTO.getComentsList();
            return new ResponseEntity(commentsList, HttpStatus
                    .OK);
        } else return new ResponseEntity<>(null, HttpStatus.OK);
    }

    // 공유캘린더 댓글 작성
    @PostMapping("/comment_write")
    public ResponseEntity<Boolean> commentsWrite(@RequestBody Map<String, String> commentsWrite) {
        Long calNo = Long.valueOf(commentsWrite.get("calNo"));
        LocalDate planDate = LocalDate.parse(commentsWrite.get("date"));
        String id = commentsWrite.get("id");
        String detail = commentsWrite.get("detail");
        boolean commentsWriteResult = scalService.commentsWrite(calNo, planDate, id, detail);
        return new ResponseEntity(commentsWriteResult, HttpStatus.OK);
    }

    // 공유캘린더 댓글 삭제하기
    @PostMapping("/comment_delete")
    public ResponseEntity<Boolean> commentsDelete(@RequestBody Map<String, String> commentsDelete) {
        Long commentsNo = Long.valueOf(commentsDelete.get("commentNo"));
        boolean commentsDeleteResult = scalService.commentsDelete(commentsNo);
        return new ResponseEntity(commentsDeleteResult, HttpStatus.OK);
    }

    // 설정 불러오기
    @GetMapping("/info_load")
    public ResponseEntity<Map<String, Object>> infoLoad(@RequestParam Long calNo, String id) {
        Map<String, Object> scalInfo = new HashMap<>();
        ShareDTO shareDTO = scalService.infoLoad(calNo, id);
        // 캘린더 이름 / 캘린더 멤버 / 오너 여부
        if(shareDTO.isOk()) {
            scalInfo.put("calName", shareDTO.getCalName());
            scalInfo.put("calMember", shareDTO.getMemberList());
            return new ResponseEntity(scalInfo, HttpStatus.OK);
        }
        return new ResponseEntity(null, HttpStatus.OK);
    }
    // 설정 저장하기
    @PostMapping("/info_save")
    public ResponseEntity<Boolean> infoSave(@RequestBody Map<String, Object> data) {
        Long calNo = (long)data.get("calNo");
        String calName = (String)data.get("calName");
        boolean result = scalService.infoSave(calNo, calName);
        return new ResponseEntity(result, HttpStatus.OK);
    }
    // 멤버 초대하기
    @PostMapping("/invite_member")
    public ResponseEntity<Boolean> inviteMember(@RequestBody Map<String, Object> data) {
        long calNo = (long) data.get("calNo");
        String id = (String)data.get("id");
        boolean result = scalService.inviteMember(calNo, id);
        return new ResponseEntity(result, HttpStatus.OK);
    }
    // 멤버 강퇴
    @PostMapping("/drop_member")
    public ResponseEntity<Boolean> dropMember(@RequestBody Map<String, Object> data) {
        Long calNo = (long)data.get("calNo");
        String id = (String)data.get("id");
        boolean result = scalService.dropMember(calNo, id);
        return new ResponseEntity(result, HttpStatus.OK);
    }
}