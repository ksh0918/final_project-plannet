package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter @Setter
public class BoardDTO {
    // board 기본 정보
    private Long boardNo;
    private String id;
    private String category;
    private String title;
    private String nickname;
    private int views;
    private LocalDateTime writeDate;
    private String detail;
    private int isChecked;
    private List<Map<String, Object>> boardList;

    // 좋아요 관련
    private int likeCnt;
    private int isLiked;

    // board comment 관련
    private List<Map<String, Object>> commentsList;

    private boolean isOk;
}