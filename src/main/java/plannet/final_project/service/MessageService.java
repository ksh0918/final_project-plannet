package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.MessageRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Message;
import plannet.final_project.vo.MessageDTO;

import javax.transaction.Transactional;
import javax.xml.bind.SchemaOutputResolver;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j // log를 찍기 위한 어노테이션
@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final MemberRepository memberRepository;

    public boolean sendMessage(String id, String receiveId, String detail){
        try{
            Message message = new Message();
            message.setUserId(memberRepository.findById(id).orElseThrow());
            String[] keywordArr = receiveId.split("#");
            Member receive = memberRepository.findByNicknameAndUserCode(keywordArr[0], keywordArr[1]);
            message.setReceiveId(receive);
            message.setDetail(detail);
            message.setDate(LocalDateTime.now());
            messageRepository.save(message);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public MessageDTO getMessageList(String id){
        MessageDTO messageDTO = new MessageDTO();
        List<Map<String,Object>> messageList = new ArrayList<>();
        try{
            List<Message> messageData = messageRepository.findAllMatchingId(id);
            for(Message e : messageData){
                Map<String,Object> message = new HashMap<>();
                message.put("messageNo",e.getMessageNo());
                message.put("receiveId",e.getReceiveId().getId());
                message.put("sendId",e.getUserId().getNickname()+"#"+e.getUserId().getUserCode());
                message.put("isRead",e.getIsRead());
                message.put("detail",e.getDetail());
                message.put("sendDate",e.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                messageList.add(message);
            }
            messageDTO.setMessageList(messageList);
            System.out.println(messageDTO.getMessageList());
            messageDTO.setOk(true);
        }catch (Exception e){
            messageDTO.setMessageList(null);
        }
        return messageDTO;
    }
    public boolean messageDelete(List<Long> messageNoArray){
        List<MessageDTO> messageDTOList = new ArrayList<>();
        try{
            for(int i = 0; i<messageNoArray.size(); i++){
                Long messageNo = messageNoArray.get(i);
                messageRepository.deleteByMessageNo(messageNo);
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
