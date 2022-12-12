package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.BoardRepository;
import plannet.final_project.dao.CommentsRepository;
import plannet.final_project.dao.LikeCntRepository;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comments;
import plannet.final_project.entity.LikeCnt;
import plannet.final_project.entity.Member;
import plannet.final_project.vo.BoardDTO;

import javax.crypto.ExemptionMechanismException;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

// 의존성 주입을 받는다: 객체 생성 없이 사용할 수 있게 한다
@Service
@RequiredArgsConstructor
@Slf4j // log를 찍기 위한 어노테이션
@Transactional
public class BoardService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository; // 의존성 주입을 받음
    private final LikeCntRepository likeCntRepository; // 의존성 주입을 받음
    private final CommentsRepository commentsRepository;

    // 보드 목록 불러오기
    public BoardDTO getBoardList() {
        BoardDTO boardDTO = new BoardDTO();
        List<Map<String, Object>> boardList = new ArrayList<>();
        try {
            List<Board> boardData = boardRepository.findAllByOrderByBoardNoDesc();
            for (Board e : boardData) {
                Map<String, Object> board = new HashMap<>();
                board.put("boardNo", e.getBoardNo());
                board.put("writerId", e.getUserId().getId());
                // 익명체크 여부 확인 후 닉네임 넣기
                if(e.getIsChecked() == 0) {
                    board.put("nickname", e.getUserId().getNickname());
                } else board.put("nickname", "익명");
                board.put("title", e.getTitle());
                board.put("views", e.getViews());
                board.put("writeDate", e.getWriteDate());
                boardList.add(board);
            }
            boardDTO.setBoardList(boardList);
            boardDTO.setOk(true);
        } catch (Exception e) {
            boardDTO.setOk(false);
        }
        return boardDTO;
    }

    // 인기글 리스트 불러오기
    public BoardDTO getTop3List() {
        System.out.println("여긴오니1");
        List<Integer> top3BoardNo = likeCntRepository.findAllTop3GroupByBoardNoOrderByCountByBoardNoDescBoardNoDesc();
        System.out.println("여긴오니2");
        for (Integer e : top3BoardNo) {
            System.out.println("여기는");
            System.out.println(e);
        }
        System.out.println("여기가 출력입니다:" + top3BoardNo);
        BoardDTO boardDTO = new BoardDTO();
        List<Map<String, Object>> boardList = new ArrayList<>();
        try {
            List<Board> boardData = boardRepository.findAllMatchingBoardNo(top3BoardNo);
            for (Board e : boardData) {
                Map<String, Object> board = new HashMap<>();
                board.put("boardNo", e.getBoardNo());
                board.put("writerId", e.getUserId().getId());
                // 익명체크 여부 확인 후 닉네임 넣기
                if(e.getIsChecked() == 0) {
                    board.put("nickname", e.getUserId().getNickname());
                } else board.put("nickname", "익명");
                board.put("title", e.getTitle());
                board.put("views", e.getViews());
                board.put("writeDate", e.getWriteDate());
                boardList.add(board);
            }
            boardDTO.setBoardList(boardList);
            boardDTO.setOk(true);
        } catch (Exception e) {
            boardDTO.setOk(false);
        }
        return boardDTO;
    }

    // 검색 키워드에 해당하는 글 목록 불러오기 불러오기
    public BoardDTO getSearchList(String keyword) {
        BoardDTO boardDTO = new BoardDTO();
        List<Map<String, Object>> boardList = new ArrayList<>();
        try {
            List<Board> boardData = boardRepository.findByTitleLikeOrDetailLikeOrderByBoardNoDesc(keyword, keyword);
            for (Board e : boardData) {
                Map<String, Object> board = new HashMap<>();
                board.put("boardNo", e.getBoardNo());
                board.put("writerId", e.getUserId().getId());
                // 익명체크 여부 확인 후 닉네임 넣기
                if(e.getIsChecked() == 0) {
                    board.put("nickname", e.getUserId().getNickname());
                } else board.put("nickname", "익명");
                board.put("title", e.getTitle());
                board.put("views", e.getViews());
                board.put("writeDate", e.getWriteDate());
                boardList.add(board);
            }
            boardDTO.setBoardList(boardList);
            boardDTO.setOk(true);
        } catch (Exception e) {
            boardDTO.setOk(false);
        }
        return boardDTO;
    }

    // 보드 넘버에 해당하는 글의 상세페이지 불러오기
    public BoardDTO getPostView(Long boardNo) {
        Board board = boardRepository.findById(boardNo).orElseThrow();
        BoardDTO boardDTO = new BoardDTO();
        try {
            boardDTO.setBoardNo(boardNo);
            boardDTO.setId(boardRepository.findById(boardNo).orElseThrow().getUserId().getId());
            boardDTO.setTitle(board.getTitle());
            int isChecked = board.getIsChecked();
            boardDTO.setIsChecked(isChecked);
            if (isChecked == 0) boardDTO.setNickname(board.getUserId().getNickname());
            else boardDTO.setNickname("익명");
            boardDTO.setViews(board.getViews());
            boardDTO.setWriteDate(board.getWriteDate());
            boardDTO.setDetail(board.getDetail());
            boardDTO.setLikeCnt(likeCntRepository.countByBoardNo(board).intValue());
            boardDTO.setOk(true);
        } catch (Exception e) {boardDTO.setOk(false);}
        return boardDTO;
    }

    // 조회수 +1
    public boolean getViews(Long boardNo) {
        Board board = boardRepository.findById(boardNo).orElseThrow();
        int CurrentViews = board.getViews() + 1;

        try {
            board.setBoardNo(boardNo);
            board.setViews(CurrentViews);
            boardRepository.save(board);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 보드 넘버에 해당하는 글의 좋아요 수
    public int getLikeCnt(Board boardNo) {
        int likeCnt = likeCntRepository.countByBoardNo(boardNo).intValue();
        return likeCnt;
    }

    // 내가 해당 게시물을 좋아요 눌렀는지 여부
    public boolean getLikeChecked(String id, Board boardNo) {
        Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        return likeCntRepository.existsByUserIdAndBoardNo(member, boardNo);
    }

    // 좋아요 버튼을 누를 때마다 데이터베이스 접근
    public boolean likeCheckedToggle(String id, Board boardNo) {
        Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        boolean CurrentLikeChecked = likeCntRepository.existsByUserIdAndBoardNo(member, boardNo);
        System.out.println("현재 좋아요" + CurrentLikeChecked);
        try {
            System.out.println("true 들어옴");
            if (CurrentLikeChecked) {likeCntRepository.deleteByUserIdAndBoardNo(member, boardNo);
                CurrentLikeChecked = !CurrentLikeChecked;
                System.out.println("true 정상수행" + CurrentLikeChecked);}
            else {
                System.out.println("false 들어옴");
                CurrentLikeChecked = !CurrentLikeChecked;
                LikeCnt likeCnt = new LikeCnt();
                likeCnt.setUserId(member);
                likeCnt.setBoardNo(boardNo);
                likeCntRepository.save(likeCnt);
                System.out.println("false 정상수행" + CurrentLikeChecked);
            }
            return CurrentLikeChecked;
        } catch (Exception e) {
            return false;
        }
    }

    // 자유게시판 댓글 불러오기
    public BoardDTO getCommentsLoad (Long boardNo) {
        BoardDTO boardDTO = new BoardDTO();
        try {
            List<Map<String, Object>> commentsList = new ArrayList<>();
            Board board = boardRepository.findById(boardNo).orElseThrow(ExemptionMechanismException::new);
            List<Comments> data = commentsRepository.findByBoardNo(board);
            for (Comments e : data) {
                Map<String, Object> comments = new HashMap<>();
                comments.put("nickname", e.getUserId().getNickname());
                comments.put("detail", e.getDetail());
                comments.put("date", e.getWriteDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                commentsList.add(comments);
            }
            boardDTO.setCommentsList(commentsList);
            boardDTO.setOk(true);
        } catch (Exception e) {
            boardDTO.setOk(false);
        }
        return boardDTO;
    }

    // 자유게시판 댓글 작성하기
    public boolean commentsWrite(Long boardNo, String id, String detail) {
        try {
            Comments comments = new Comments();
            comments.setUserId(memberRepository.findById(id).orElseThrow());
            comments.setBoardNo(boardRepository.findById(boardNo).orElseThrow());
            comments.setDetail(detail);
            comments.setWriteDate(LocalDateTime.now());
            commentsRepository.save(comments);
            return true;
        } catch (Exception e) {
            return true;
        }
    }


    // 자유게시판 댓글 삭제하기
    public boolean commentsDelete(Long commentNo) {
        System.out.println("여긴 들어오니");
        try {
            System.out.println("여긴");
            commentsRepository.deleteById(commentNo);
            System.out.println("여긴?");
//            Comments comments = new Comments();
//
//            comments.setUserId(memberRepository.findById(id).orElseThrow());
//            comments.setBoardNo(boardRepository.findById(boardNo).orElseThrow());
//            comments.setDetail(detail);
//            comments.setWriteDate(LocalDateTime.now());
//            commentsRepository.save(comments);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    // 자유게시판 글 작성하기
    public boolean boardWrite(String id, String title, String detail, int isChecked){
        try {
            Board board = new Board();
            board.setUserId(memberRepository.findById(id).orElseThrow());
            board.setTitle(title);
            board.setDetail(detail);
            board.setIsChecked(isChecked);
            board.setWriteDate(LocalDateTime.now());
            boardRepository.save(board);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    // 자유게시판 글 수정하기
    public boolean boardEdit(String userId, Long boardNo, String title, String detail) {
        try{
            Board board = boardRepository.findById(boardNo).orElseThrow(EmptyStackException::new);
            board.setTitle(title);
            board.setDetail(detail);
            Board rst = boardRepository.save(board);
            log.warn(rst.toString());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    // 자유게시판 글 삭제하기
    public boolean boardDelete(Long boardNo) {
        Board board = boardRepository.findById(boardNo).orElseThrow();
        try {
            commentsRepository.deleteByBoardNo(board); // 댓글 엔티티네서 게시판번호가 외래키이므로 게시글을 삭제하려면 댓글들도 삭제해야지만 게시글이 삭제됨
            boardRepository.deleteById(boardNo);
            return true;
        } catch (Exception e){
            return false;
        }
    }
}