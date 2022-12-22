package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDate;

@Getter @Setter
@ToString
@Entity
@SequenceGenerator(
        name = "DIARY_GENERATOR",
        sequenceName = "DIARY_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DIARY_GENERATOR")
    private Long diaryNo ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    private Member userId;

    @CreatedDate
    private LocalDate diaryDate;

    @Column(length = 2400, nullable = false)
    private String diary;
}