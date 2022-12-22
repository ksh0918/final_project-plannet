package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private Member userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_id")
    private Member friendId;
}