package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter @Setter
@ToString
@Entity
@SequenceGenerator(
    name = "QUOTE_GENERATOR",
    sequenceName = "QUOTE_SEQUENCES",
    initialValue = 1, allocationSize = 1)
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "QUOTE_GENERATOR")
    private int quoteNo;
    
    @Column(length = 500, nullable = false)
    private String quote;
}