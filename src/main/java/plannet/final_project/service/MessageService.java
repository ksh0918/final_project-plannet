package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.MessageRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Message;
import plannet.final_project.vo.MessageDTO;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j // log를 찍기 위한 어노테이션
@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {
    private final MemberRepository memberRepository;
    private final MessageRepository messageRepository;

    public Integer messageCntNoti(String id) {
        int cnt = 0;
        try {
            List<Message> messageData = messageRepository.findAllMatchingId(id);
            for(Message e : messageData) {
                if(e.getIsRead()==0) { cnt++; }
            }
        } catch (Exception e) {
            return cnt;
        }
        return cnt;
    }

    public MessageDTO messageListLoad(String id) {
        MessageDTO messageDTO = new MessageDTO();
        List<Map<String,Object>> messageList = new ArrayList<>();
        try {
            List<Message> messageData = messageRepository.findAllMatchingId(id);
            for(Message e : messageData){
                Map<String,Object> message = new HashMap<>();
                message.put("messageNo",e.getMessageNo());
                message.put("sendId",e.getUserId().getNickname()+"#"+e.getUserId().getUserCode());
                message.put("receiveId",e.getReceiveId().getId());
                message.put("detail",e.getDetail());
                message.put("sendDate",e.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                message.put("isRead",e.getIsRead());
                messageList.add(message);
            }
            messageDTO.setMessageList(messageList);
            messageDTO.setOk(true);
        }catch (Exception e){
            messageDTO.setMessageList(null);
        }
        return messageDTO;
    }

    public boolean messageSend(String id, String receiveId, String detail) {
        try {
            Message message = new Message();
            message.setUserId(memberRepository.findById(id).orElseThrow());
            String[] keywordArr = receiveId.split("#");
            Member receive = memberRepository.findByNicknameAndUserCode(keywordArr[0], keywordArr[1]);
            message.setReceiveId(receive);
            message.setDetail(detail);
            message.setDate(LocalDateTime.now());
            messageRepository.save(message);
            return true;
        } catch (Exception e){
            return false;
        }
    }

    public boolean messageDelete(List<Long> messageNoArray) {
        try {
            for(int i = 0; i < messageNoArray.size(); i++){
                Long messageNo = messageNoArray.get(i);
                messageRepository.deleteByMessageNo(messageNo);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean messageRead(List<Long> messageNoArray) {
        try {
            for(int i = 0; i < messageNoArray.size(); i++) {
                Long messageNo = messageNoArray.get(i);
                Message message = messageRepository.findById(messageNo).orElseThrow(EmptyStackException::new);
                message.setIsRead(1);
                messageRepository.save(message);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean messageModalOpen(Long messageNo) {
        try {
            Message message = messageRepository.findById(messageNo).orElseThrow(EmptyStackException::new);
            message.setIsRead(1);
            messageRepository.save(message);
            return true;
        } catch (Exception e){
            return false;
        }
    }

    public MessageDTO searchListLoad(String receiveId, String keyword) {
        MessageDTO messageDTO = new MessageDTO();
        List<Map<String, Object>> messageList = new ArrayList<>();
        String key = "%" + keyword + "%";
        System.out.println("ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ");
        System.out.println(key);
        try {
            System.out.println("3eeeeeeeeeeeeeeee");
            List<Message> messageData = messageRepository.findByReceiveIdAndDetailLikeOrderByDateDesc(receiveId, key);
            for(Message e : messageData){
                Map<String,Object> message = new HashMap<>();
                message.put("messageNo",e.getMessageNo());
                message.put("sendId",e.getUserId().getNickname()+"#"+e.getUserId().getUserCode());
                message.put("receiveId",e.getReceiveId().getId());
                message.put("detail",e.getDetail());
                message.put("sendDate",e.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                message.put("isRead",e.getIsRead());
                messageList.add(message);
            }
            messageDTO.setMessageList(messageList);
            messageDTO.setOk(true);
        } catch (Exception e) {
            messageDTO.setOk(false);
        }
        return messageDTO;
    }
}