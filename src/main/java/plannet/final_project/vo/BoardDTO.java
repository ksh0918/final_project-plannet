package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter @Setter
public class BoardDTO {
    private Long boardNo;
    private String id;
    private String title;
    private String nickname;
    private int views;
    private LocalDateTime writeDate;
    private String detail;
    private int isChecked;

    private int likeCnt;
    private int isLiked;

    private String commentWriter;
    private LocalDateTime commentDate;
    private String commentDetail;
    private boolean isOk;

   private List<Map<String, Object>> boardList;
   private Map<String, Object> postView;
   private List<Map<String, Object>> commentList;
}


