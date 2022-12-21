package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.MessageService;
import plannet.final_project.vo.MessageDTO;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
@Transactional
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Map<String,String>> sendMessage(@RequestBody Map<String,String> regData){
        try{
            String id = regData.get("id");
            String receiveId = regData.get("receiveId");
            String detail = regData.get("detail");
            boolean result = messageService.sendMessage(id,receiveId,detail);
            if(result){
                return new ResponseEntity(true, HttpStatus.OK);
            }
            else{
                return new ResponseEntity(false, HttpStatus.OK);
            }
        }catch (Exception e){
            log.warn(String.valueOf(e));
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> messageList(@RequestParam String receiveId) {
        MessageDTO messageList = messageService.getMessageList(receiveId);
        System.out.println(messageList);
        if(messageList.isOk()){
            return new ResponseEntity(messageList.getMessageList(),HttpStatus.OK);
        }
        else return new ResponseEntity(null,HttpStatus.BAD_REQUEST);
    }
    @GetMapping("messageNoti")
    public ResponseEntity<List<Map<String, Object>>> messageNoti(@RequestParam String receiveId) {
        int messageNoti = messageService.getMessageNotiList(receiveId);
        System.out.println(messageNoti);
        if(messageNoti!=0){
            return new ResponseEntity(messageNoti,HttpStatus.OK);
        }
        else return new ResponseEntity(null,HttpStatus.BAD_REQUEST);
    }
    @PostMapping("/delete")
    public ResponseEntity<Boolean> messageDelete(@RequestBody List<Long> messageData) {
        System.out.println(messageData);
        try {
            boolean messageDelete = messageService.messageDelete(messageData);
            if(messageDelete){
                return new ResponseEntity(true, HttpStatus.OK);
            }
            else{
                return new ResponseEntity(false, HttpStatus.OK);
            }
        }catch (Exception e) {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }
    @PostMapping("/read")
    public ResponseEntity<Boolean> messageRead(@RequestBody List<Long> messageData){
        try{
            boolean messageRead= messageService.messageRead(messageData);
            if(messageRead){
                return new ResponseEntity(true, HttpStatus.OK);
            }
            else{
                return new ResponseEntity(false, HttpStatus.OK);
            }
        }catch (Exception e) {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }
}
