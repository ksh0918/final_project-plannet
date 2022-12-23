package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.NotiService;
import plannet.final_project.vo.NotiDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/noti")
@RequiredArgsConstructor
public class NotiController {
    private final NotiService notiService;

    @GetMapping("/friend_load")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> friendLoad(@RequestParam String id) {
        Map<String, List<Map<String, Object>>> friendList = new HashMap<>();
        NotiDTO notiDTO = notiService.friendLoad(id);
        if(notiDTO.getFriendList().size() == 0) friendList.put("friendList", null);
        else friendList.put("friendList", notiDTO.getFriendList());
        if(notiDTO.getNotiList().size() == 0) friendList.put("notiList", null);
        else friendList.put("notiList", notiDTO.getNotiList());
        return new ResponseEntity(friendList, HttpStatus.OK);
    }

    @PostMapping("/friend_add")
    public ResponseEntity<Integer> friendAdd(@RequestBody Map<String, String> data) {
        String id = data.get("id");
        String keyword = data.get("keyword");
        int status = notiService.friendAdd(id, keyword);
        return new ResponseEntity(status, HttpStatus.OK);
    }

    @PostMapping("/unfriend")
    public ResponseEntity<Integer> unfriend(@RequestBody Map<String, Long> data) {
        long key = data.get("key");
        boolean status = notiService.unfriend(key);
        return new ResponseEntity(status, HttpStatus.OK);
    }

    @PostMapping("/noti_response")
    public ResponseEntity<Boolean> notiResponse(@RequestBody Map<String, String> data) {
        log.warn(String.valueOf(data));
        Long key = Long.valueOf(data.get("key"));
        boolean status = Boolean.parseBoolean(data.get("status"));
        boolean isOk = notiService.notiResponse(key, status);
        return new ResponseEntity(isOk, HttpStatus.OK);
    }

    @GetMapping("/cnt_check")
    public ResponseEntity<Boolean> scalCntCheck(@RequestParam String id) {
        boolean isOk = notiService.scalCntCheck(id);
        return new ResponseEntity(isOk, HttpStatus.OK);
    }
}