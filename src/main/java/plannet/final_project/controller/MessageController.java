package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.MessageService;
import plannet.final_project.vo.MessageDTO;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
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
    public ResponseEntity<List<MessageDTO>> messageList(String id) {
        MessageDTO messageList = messageService.getMessageList(id);
        if(messageList.isOk()){
            return new ResponseEntity(messageList.getMessageList(),HttpStatus.OK);
        }
        else return new ResponseEntity(null,HttpStatus.BAD_REQUEST);
    }
}
