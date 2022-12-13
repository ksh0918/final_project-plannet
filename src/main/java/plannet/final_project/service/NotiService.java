package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.FriendRepository;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.NotiRepository;

import javax.transaction.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class NotiService {
    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;
    private final NotiRepository notiRepository;
}
