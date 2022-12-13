package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.FriendRepository;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.NotiRepository;
import plannet.final_project.entity.Friend;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Noti;
import plannet.final_project.vo.NotiDTO;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class NotiService {
    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;
    private final NotiRepository notiRepository;

    public int addFriend (String id, String keyword){
        //해당 유저가 없다면 0
        //친구추가를 할 수 있는 유저라면 1
        //친구추가가 되어있다면 2
        int result = 0;
        log.warn("서비스 들어옴");
        try {
            // 내 정보(친구요청을 보내는 사용자의 정보를 찾는다)
            Member send = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
            //친구추가할 사람이 존재하는 지 확인
            String[] keywordArr = keyword.split("#");
            Member recive = memberRepository.findByNicknameAndUserCode(keywordArr[0], keywordArr[1]);

            if(recive == null) { // 해당 유저가 없음 0
                return result;
            } else { //해당 유저가 있음
                //자신에게 친구추가를 신청한 경우 5
                System.out.println(recive.getId() + "aaaaaa" + id);
                if(id.equals(recive.getId())) {
                    result = 5;
                } else {
                    //타인에게 걸었을 경우 친구인지 확인
                    Friend isFriend = friendRepository.findByUserIdAndFriendId(send, recive);
                    if(isFriend == null) { //친구가 아니라면
                        //내가 이미 보낸 요청 사항이 있는지 확인한다.
                        Noti alreadySend = notiRepository.findByUserIdAndReceiveId(send, recive);
                        Noti alreadyReceive = notiRepository.findByUserIdAndReceiveId(recive, send);
                        // 이미 내가 보낸 요청사항이 있음
                        if(alreadySend != null && alreadySend.getType().equals("F") && alreadySend.getIsChecked() == 0) {
                            result = 3;
                        // 상대가 보낸 요청사항이 있음
                        } else if(alreadyReceive != null && alreadyReceive.getType().equals("F") && alreadyReceive.getIsChecked() == 0) {
                            result = 4;
                        } else { //상호 요청사항이 없고, 친구도 아님
                            Noti noti = new Noti();
                            noti.setUserId(send);
                            noti.setReceiveId(recive);
                            noti.setType("F");
                            noti.setInviteDate(LocalDateTime.now());
                            noti.setIsChecked(0);
                            notiRepository.save(noti);
                            result = 1;
                        }
                    } else {
                        result = 2;
                    }
                }
            }
            return result;
        } catch (Exception e) {
            return result; // 해당유저 없음 0
        }
    }
    public NotiDTO friendPageLoad(String id) {
        NotiDTO notiDTO = new NotiDTO();
        Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        //친구 리스트
        List<Map<String, Object>> friendList = new ArrayList<>();
        List<Friend> friendData = friendRepository.findByUserId(member);
        if(friendData != null) {
            for(Friend e : friendData) {
                Map<String, Object> friend = new HashMap<>();
                friend.put("key", e.getFriendNo());
                friend.put("proImg", e.getFriendId().getProImg());
                friend.put("nickname", e.getFriendId().getNickname());
                friend.put("userCode", e.getFriendId().getUserCode());
                friend.put("profile", e.getFriendId().getProfile());
                friendList.add(friend);
            }
        }
        notiDTO.setFriendList(friendList);
        //알림 리스트
        List<Map<String, Object>> notiList = new ArrayList<>();
        List<Noti> notiData = notiRepository.findByReceiveIdAndIsChecked(member, 0);
        if(notiData != null) {
            for(Noti e : notiData) {
                Map<String, Object> noti = new HashMap<>();
                noti.put("key", e.getNotiNo());
                noti.put("nickname", e.getUserId().getNickname());
                noti.put("userCode", e.getUserId().getUserCode());
                noti.put("type", e.getType());
                notiList.add(noti);
            }
        }
        notiDTO.setNotiList(notiList);

        return notiDTO;
    }
}
