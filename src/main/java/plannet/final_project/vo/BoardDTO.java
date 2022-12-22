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
    private String nickname;
    private String category;
    private String title;
    private int views;
    private LocalDateTime writeDate;
    private String detail;
    private int isChecked;
    private List<Map<String, Object>> boardList;
    private int likeCnt;
    private List<Map<String, Object>> commentList;

    private boolean isOk;
}