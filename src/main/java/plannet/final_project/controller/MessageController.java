package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.entity.Message;
import plannet.final_project.service.MessageService;
import plannet.final_project.vo.BoardDTO;
import plannet.final_project.vo.MessageDTO;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
@Transactional
public class MessageController {
    private final MessageService messageService;

    // 쪽지 갯수 불러오기(말풍선)
    @GetMapping("/cntNoti")
    public ResponseEntity<List<Map<String, Object>>> messageCntNoti(@RequestParam String receiveId) {
        int messageNoti = messageService.messageCntNoti(receiveId);
        if(messageNoti!=0) return new ResponseEntity(messageNoti, HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 쪽지 리스트 불러오기
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> messageList(@RequestParam String receiveId) {
        MessageDTO messageList = messageService.messageListLoad(receiveId);
        if(messageList.isOk()) return new ResponseEntity(messageList.getMessageList(), HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }

    // 쪽지 보내기
    @PostMapping("/send")
    public ResponseEntity<Map<String,String>> messageSend(@RequestBody Map<String,String> data){
        try{
            String id = data.get("id");
            String receiveId = data.get("receiveId");
            String detail = data.get("detail");
            boolean result = messageService.messageSend(id, receiveId, detail);
            if(result) return new ResponseEntity(true, HttpStatus.OK);
            else return new ResponseEntity(null, HttpStatus.OK);
        } catch (Exception e) {
            log.warn(String.valueOf(e));
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 쪽지 삭제
    @PostMapping("/delete")
    public ResponseEntity<Boolean> messageDelete(@RequestBody List<Long> data) {
        try {
            boolean messageDelete = messageService.messageDelete(data);
            if(messageDelete) return new ResponseEntity(true, HttpStatus.OK);
            else return new ResponseEntity(null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 쪽지 읽음 표시
    @PostMapping("/read")
    public ResponseEntity<Boolean> messageRead(@RequestBody List<Long> data) {
        try {
            boolean messageRead = messageService.messageRead(data);
            if(messageRead) return new ResponseEntity(true, HttpStatus.OK);
            else return new ResponseEntity(null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 쪽지 읽을 때 모달을 띄어 줌
    @PostMapping("/readModal")
    public ResponseEntity<Boolean> messageModalOpen(@RequestBody Map<String,Long> data) {
        Long messageNo= data.get("messageNo");
        try {
            boolean messageRead= messageService.messageModalOpen(messageNo);
            if(messageRead) return new ResponseEntity(true, HttpStatus.OK);
            else return new ResponseEntity(null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 쪽지 검색하기
    @GetMapping("/search_messageList")
    public ResponseEntity<List<MessageDTO>> searchListLoad(@RequestParam String receive_id, String keyword) {
        MessageDTO messageList = messageService.searchListLoad(receive_id, keyword);
        System.out.println(messageList.isOk());
        if(messageList.isOk()) return new ResponseEntity(messageList.getMessageList(), HttpStatus.OK);
        else return new ResponseEntity(null, HttpStatus.OK);
    }
}