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

    // 공유 캘린더 생성하기
    @PostMapping("/create")
    public ResponseEntity<Boolean> scalCreate(@RequestBody Map<String, Object> create) {
        String id = (String)create.get("id");
        String title = (String)create.get("title");
        List<Map<String, Object>> smember = (List<Map<String, Object>>)create.get("checkedButton");
        Long result = scalService.scalCreate(id, title, smember);
        if(result != -1) return new ResponseEntity(result, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 공유캘린더 삭제하기
    @PostMapping("/delete")
    public ResponseEntity<Boolean> scalDelete(@RequestBody Map<String, String> scalDelete) {
        Long scalNo = Long.valueOf((String) scalDelete.get("scalNo"));
        boolean result = scalService.scalDelete(scalNo);
        if (result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 멤버 초대하기
    @PostMapping("/member_invite")
    public ResponseEntity<Boolean> memberInvite(@RequestBody Map<String, Object> memberInvite) {
        Long scalNo = Long.parseLong((String)memberInvite.get("scalNo"));
        String id = (String)memberInvite.get("id");
        boolean result = scalService.memberInvite(scalNo, id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    // 멤버 삭제
    @PostMapping("/member_delete")
    public ResponseEntity<Boolean> memberDelete(@RequestBody Map<String, Object> memberDelete) {
        Long scalNo = Long.parseLong((String)memberDelete.get("scalNo"));
        String id = (String)memberDelete.get("id");
        boolean result = scalService.memberDelete(scalNo, id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    // 공유 캘린더 정보 저장하기
    @PostMapping("/info_save")
    public ResponseEntity<Boolean> infoSave(@RequestBody Map<String, Object> infoSave) {
        Long scalNo = Long.parseLong((String)infoSave.get("scalNo"));
        String scalName = (String)infoSave.get("scalName");
        boolean result = scalService.infoSave(scalNo, scalName);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    // 해당 캘린더의 각 정보 불러오기
    @GetMapping("/sharing")
    public ResponseEntity<List<Map<String, Object>>> sharingHome(@RequestParam Long scalNo) {
        Map<String, Object> sharingHome = new HashMap<>();
        ShareDTO shareDTO = scalService.homeList(scalNo);
        if(shareDTO.isOk()) {
            sharingHome.put("scalName", shareDTO.getScalName());
            sharingHome.put("slist", shareDTO.getSweekPlan());
            sharingHome.put("splanMark", shareDTO.getSplanMark());
            sharingHome.put("smemo", shareDTO.getSmemo());
            return new ResponseEntity(sharingHome, HttpStatus.OK);
        } else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 메모 수정 및 저장
    @PostMapping("/memo")
    public ResponseEntity<Boolean> memoSave(@RequestBody Map<String, String> scalMemo) {
        Long scalNo = Long.parseLong(scalMemo.get("scalNo"));
        String detail = scalMemo.get("detail");
        boolean result = scalService.memoSave(scalNo, detail);
        if(result) return new ResponseEntity(result, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 공유캘린더 일정 불러오기
    @PostMapping("/splan_load")
    public ResponseEntity<List<ShareDTO>> writeLoad(@RequestBody Map<String, String> splanLoad) {
        Long scalNo = Long.valueOf(splanLoad.get("scalNo"));
        LocalDate date = LocalDate.parse(splanLoad.get("date"));
        ShareDTO shareDTO = scalService.splanLoad(scalNo, date);
        if (shareDTO.isOk()) return new ResponseEntity(shareDTO.getSplanList(), HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 공유캘린더 일정 작성하기
    @PostMapping("/plan_save")
    public ResponseEntity<Boolean> writeSave(@RequestBody Map<String, Object> splanData) {
        Long scalNo = Long.valueOf((String) splanData.get("scalNo"));
        String userId = (String)splanData.get("id");
        LocalDate date = LocalDate.parse((String)splanData.get("date"));
        List<Map<String, Object>> plan = (List<Map<String, Object>>)splanData.get("planList");
        boolean result = scalService.splanSave(scalNo, userId, date, plan);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 공유캘린더 댓글 불러오기
    @PostMapping("/comment_load")
    public ResponseEntity<List<Map<String, Object>>> commentLoad(@RequestBody Map<String, String> scommentData) {
        Long scalNo = Long.valueOf(scommentData.get("scalNo"));
        LocalDate planDate = LocalDate.parse(scommentData.get("planDate"));
        ShareDTO shareDTO = scalService.commentLoad(scalNo, planDate);
        if(shareDTO.isOk()) {
            List<Map<String, Object>> commentList = shareDTO.getScommentList();
            return new ResponseEntity(commentList, HttpStatus.OK);
        } else return new ResponseEntity<>(null, HttpStatus.OK);
    }

    // 공유캘린더 댓글 작성
    @PostMapping("/comment_save")
    public ResponseEntity<Boolean> commentSave(@RequestBody Map<String, String> commentSave) {
        Long scalNo = Long.valueOf(commentSave.get("scalNo"));
        String id = commentSave.get("id");
        LocalDate planDate = LocalDate.parse(commentSave.get("planDate"));
        String detail = commentSave.get("detail");
        boolean result = scalService.commentSave(scalNo, id, planDate, detail);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    // 공유캘린더 댓글 삭제하기
    @PostMapping("/comment_delete")
    public ResponseEntity<Boolean> commentDelete(@RequestBody Map<String, String> commentDelete) {
        Long commentNo = Long.valueOf(commentDelete.get("commentNo"));
        boolean commentDeleteResult = scalService.commentDelete(commentNo);
        return new ResponseEntity(commentDeleteResult, HttpStatus.OK);
    }

    // 공유캘린더 정보 불러오기
    @GetMapping("/info_load")
    public ResponseEntity<Map<String, Object>> infoLoad(@RequestParam Long scalNo, String id) {
        Map<String, Object> scalInfo = new HashMap<>();
        ShareDTO shareDTO = scalService.infoLoad(scalNo, id);
        // 캘린더 이름 / 캘린더 멤버 / 오너 여부
        if(shareDTO.isOk()) {
            scalInfo.put("scalName", shareDTO.getScalName());
            scalInfo.put("scalMember", shareDTO.getSmemberList());
            scalInfo.put("scalOwner", shareDTO.getScalOwner());
            return new ResponseEntity(scalInfo, HttpStatus.OK);
        }
        return new ResponseEntity(null, HttpStatus.OK);
    }
}