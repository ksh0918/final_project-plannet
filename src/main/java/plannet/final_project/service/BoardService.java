package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.BoardRepository;
import plannet.final_project.dao.LikeRepository;
import plannet.final_project.dao.CommentRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.LikeList;
import plannet.final_project.entity.Comment;
import plannet.final_project.vo.BoardDTO;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

// 의존성 주입을 받는다: 객체 생성 없이 사용할 수 있게 한다
@Slf4j // log를 찍기 위한 어노테이션
@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository; // 의존성 주입을 받음
    private final LikeRepository likeRepository; // 의존성 주입을 받음
    private final CommentRepository commentRepository;

    // 보드 목록 불러오기
    public BoardDTO boardListLoad() {
        BoardDTO boardDTO = new BoardDTO();
        List<Map<String, Object>> boardList = new ArrayList<>();
        try {
            List<Board> boardData = boardRepository.findAllByOrderByBoardNoDesc();
            for (Board e : boardData) {
                Map<String, Object> board = new HashMap<>();
                board.put("boardNo", e.getBoardNo());
                board.put("writerId", e.getUserId().getId());
                // 익명체크 여부 확인 후 닉네임 넣기
                if(e.getIsChecked() == 0) board.put("nickname", e.getUserId().getNickname());
                else board.put("nickname", "익명");
                board.put("category", e.getCategory());
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
    public BoardDTO top3ListLoad() {
        List<Integer> top3BoardNo = likeRepository.findAllTop3GroupByBoardNoOrderByCountByBoardNoDescBoardNoDesc();
        BoardDTO boardDTO = new BoardDTO();
        List<Map<String, Object>> boardList = new ArrayList<>();
        try {
            List<Board> boardData = boardRepository.findAllMatchingBoardNo(top3BoardNo);
            for (Board e : boardData) {
                Map<String, Object> board = new HashMap<>();
                board.put("boardNo", e.getBoardNo());
                board.put("writerId", e.getUserId().getId());
                // 익명체크 여부 확인 후 닉네임 넣기
                if(e.getIsChecked() == 0) board.put("nickname", e.getUserId().getNickname());
                else board.put("nickname", "익명");
                board.put("category", e.getCategory());
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
    public BoardDTO searchListLoad(String keyword) {
        BoardDTO boardDTO = new BoardDTO();
        List<Map<String, Object>> boardList = new ArrayList<>();
        try {
            List<Board> boardData = boardRepository.findByTitleLikeOrDetailLikeOrderByBoardNoDesc(keyword, keyword);
            for (Board e : boardData) {
                Map<String, Object> board = new HashMap<>();
                board.put("boardNo", e.getBoardNo());
                board.put("writerId", e.getUserId().getId());
                // 익명체크 여부 확인 후 닉네임 넣기
                if(e.getIsChecked() == 0) board.put("nickname", e.getUserId().getNickname());
                else board.put("nickname", "익명");
                board.put("category", e.getCategory());
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
    public BoardDTO postViewLoad(Long boardNo) {
        Board board = boardRepository.findById(boardNo).orElseThrow();
        BoardDTO boardDTO = new BoardDTO();
        try {
            boardDTO.setBoardNo(boardNo);
            boardDTO.setId(boardRepository.findById(boardNo).orElseThrow().getUserId().getId());
            boardDTO.setCategory(board.getCategory());
            boardDTO.setTitle(board.getTitle());
            int isChecked = board.getIsChecked();
            boardDTO.setIsChecked(isChecked);
            if (isChecked == 0) boardDTO.setNickname(board.getUserId().getNickname());
            else boardDTO.setNickname("익명");
            boardDTO.setViews(board.getViews());
            boardDTO.setWriteDate(board.getWriteDate());
            boardDTO.setDetail(board.getDetail());
            boardDTO.setLikeCnt(likeRepository.countByBoardNo(board).intValue());
            boardDTO.setOk(true);
        } catch (Exception e) {boardDTO.setOk(false);}
        return boardDTO;
    }

    // 조회수 +1
    public boolean viewUp(Long boardNo) {
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
    public int likeCntLoad(Board boardNo) {
        int likeCnt = likeRepository.countByBoardNo(boardNo).intValue();
        return likeCnt;
    }

    // 내가 해당 게시물을 좋아요 눌렀는지 여부
    public boolean likeCheckedLoad(Board boardNo, String id) {
        Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        return likeRepository.existsByUserIdAndBoardNo(member, boardNo);
    }

    // 좋아요 버튼을 누를 때마다 데이터베이스 접근
    public boolean likeCheckedToggle(Board boardNo, String id) {
        Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        boolean CurrentLikeChecked = likeRepository.existsByUserIdAndBoardNo(member, boardNo);
        try {
            if (CurrentLikeChecked) {
                likeRepository.deleteByUserIdAndBoardNo(member, boardNo);
                CurrentLikeChecked = !CurrentLikeChecked;
            }
            else {
                CurrentLikeChecked = !CurrentLikeChecked;
                LikeList likeList = new LikeList();
                likeList.setUserId(member);
                likeList.setBoardNo(boardNo);
                likeRepository.save(likeList);
            }
            return CurrentLikeChecked;
        } catch (Exception e) {
            return false;
        }
    }

    // 자유게시판 댓글 불러오기
    public BoardDTO commentListLoad (Long boardNo, Long offsetNum, Long limitNum) {
        BoardDTO boardDTO = new BoardDTO();
        try {
            List<Map<String, Object>> commentList = new ArrayList<>();
            List<Comment> data = commentRepository.findComment(boardNo, offsetNum, limitNum);
            for (Comment e : data) {
                Map<String, Object> comment = new HashMap<>();
                comment.put("commentNo", e.getCommentNo());
                comment.put("writerId", e.getUserId().getId());
                comment.put("nickname", e.getUserId().getNickname());
                comment.put("detail", e.getDetail());
                comment.put("date", e.getWriteDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                commentList.add(comment);
            }
            boardDTO.setCommentList(commentList);
            boardDTO.setOk(true);
        } catch (Exception e) {
            boardDTO.setOk(false);
        }
        return boardDTO;
    }

    // 자유게시판 댓글 작성하기
    public boolean commentWrite(Long boardNo, String id, String detail) {
        try {
            Comment comment = new Comment();
            comment.setUserId(memberRepository.findById(id).orElseThrow());
            comment.setBoardNo(boardRepository.findById(boardNo).orElseThrow());
            comment.setDetail(detail);
            comment.setWriteDate(LocalDateTime.now());
            commentRepository.save(comment);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    // 자유게시판 댓글 삭제하기
    public boolean commentDelete(Long commentNo) {
        try {
            commentRepository.deleteById(commentNo);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 자유게시판 글 작성하기
    public Long boardWrite(String id, String category, String title, String detail, int isChecked){
        Long resultNo = Long.valueOf(0);
        try {
            Board board = new Board();
            board.setUserId(memberRepository.findById(id).orElseThrow());
            board.setCategory(category);
            board.setTitle(title);
            board.setDetail(detail);
            board.setIsChecked(isChecked);
            board.setWriteDate(LocalDateTime.now());
            boardRepository.save(board);
            resultNo = boardRepository.findLastBoardNo(id);
            return resultNo;
        } catch (Exception e) {
            return resultNo;
        }
    }

    // 자유게시판 글 수정하기
    public boolean boardEdit(Long boardNo, String category, String title, String detail) {
        try {
            Board board = boardRepository.findById(boardNo).orElseThrow(EmptyStackException::new);
            board.setCategory(category);
            board.setTitle(title);
            board.setDetail(detail);
            boardRepository.save(board);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    // 자유게시판 글 삭제하기
    public boolean boardDelete(Long boardNo) {
        Board board = boardRepository.findById(boardNo).orElseThrow();
        try {
            commentRepository.deleteByBoardNo(board); // 댓글 엔티티네서 게시판번호가 외래키이므로 게시글을 삭제하려면 댓글들도 삭제해야지만 게시글이 삭제됨
            likeRepository.deleteByBoardNo(board);
            boardRepository.deleteById(boardNo);
            return true;
        } catch (Exception e){
            return false;
        }
    }
}