package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.NotiService;
import plannet.final_project.vo.NotiDTO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/noti")
@RequiredArgsConstructor
public class NotiController {
    private final NotiService notiService;

    @PostMapping("/add_friend")
    public ResponseEntity<Integer> addFriend(@RequestBody Map<String, String> data) {
        // 서비스를 다녀옴
        String id = data.get("id");
        String keyword = data.get("keyword");
        int status = notiService.addFriend(id, keyword);
        return new ResponseEntity(status, HttpStatus.OK);
    }
    @PostMapping("/unfriend")
    public ResponseEntity<Integer> unfriend(@RequestBody Map<String, Long> data) {
        System.out.println(data.get("key"));
        // 서비스를 다녀옴
        long key = data.get("key");
        boolean status = notiService.unfriend(key);
        return new ResponseEntity(status, HttpStatus.OK);
    }

    @GetMapping("/friend_page_load")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> friendPageLoad(@RequestParam String id) {
        Map<String, List<Map<String, Object>>> friendPageList = new HashMap<>();
        NotiDTO notiDTO = notiService.friendPageLoad(id);
        if(notiDTO.getFriendList().size() == 0) {
            friendPageList.put("friendList", null);
        } else {
            friendPageList.put("friendList", notiDTO.getFriendList());
        }
        if(notiDTO.getNotiList().size() == 0) {
            friendPageList.put("notiList", null);
        } else {
            friendPageList.put("notiList", notiDTO.getNotiList());
        }
        return new ResponseEntity(friendPageList, HttpStatus.OK);
    }
    @GetMapping("/noti_answer")
    public ResponseEntity<Boolean> notiAnswer(@RequestParam Long key, boolean status) {
        boolean isOk = notiService.notiAnswer(key, status);
        return new ResponseEntity(isOk, HttpStatus.OK);
    }
    @GetMapping("/check")
    public ResponseEntity<Boolean> scalCheck(@RequestParam String id) {
        boolean isOk = notiService.scalCheck(id);
        return new ResponseEntity(isOk, HttpStatus.OK);
    }



}
