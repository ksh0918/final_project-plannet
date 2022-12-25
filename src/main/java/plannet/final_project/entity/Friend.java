package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Getter @Setter
@ToString
@Entity
@SequenceGenerator(
        name = "FRIEND_GENERATOR",
        sequenceName = "FRIEND_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FRIEND_GENERATOR")
    private Long friendNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member friendId;
}