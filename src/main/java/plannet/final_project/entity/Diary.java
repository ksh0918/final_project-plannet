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
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long diaryNo ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId;

    @CreatedDate
    private LocalDate diaryDate;

    @Column(length = 2400, nullable = false)
    private String diary;
}
