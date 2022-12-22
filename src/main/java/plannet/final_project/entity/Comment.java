package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter @Setter
@ToString
@Entity
@SequenceGenerator(
        name = "COMMENT_GENERATOR",
        sequenceName = "COMMENT_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "COMMENT_GENERATOR")
    private Long commentNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "board_no")
    private Board boardNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    private Member userId;

    @CreatedDate
    private LocalDateTime writeDate;

    @Column(nullable = false, length = 500)
    private String detail;
}