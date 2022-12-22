package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter @Setter
@ToString
@Entity
@Table(name = "like_list")
@SequenceGenerator(
        name = "LIKELIST_GENERATOR",
        sequenceName = "LIKELIST_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class LikeList {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LIKELIST_GENERATOR")
    private Long likeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boardNo") // JoinColumn 의 name 은 조인할 컬럼명을 기입 (SQL 기준 컬럼명)
    private Board boardNo;
}