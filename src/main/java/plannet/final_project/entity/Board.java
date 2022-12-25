package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@ToString
@Entity
@SequenceGenerator(
    name = "BOARD_GENERATOR",
    sequenceName = "BOARD_SEQUENCES",
    initialValue = 1, allocationSize = 1)
public class Board {
    @Id
    // 키 값을 생성하는 전략 : 기본키 생성을 JPA 기준
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOARD_GENERATOR")
    private Long boardNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    private Member userId;

    @Column(length = 10, nullable = false)
    private String category;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(nullable = false)
    @ColumnDefault("0")
    private int views;

    @CreatedDate
    private LocalDateTime writeDate;

    @Lob
    @Column(nullable = false)
    private String detail;

    @Column(name = "ischecked", nullable = false)
    @ColumnDefault("0")
    private int isChecked;

    @OneToMany(mappedBy = "boardNo", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<LikeList> likeLists;
}