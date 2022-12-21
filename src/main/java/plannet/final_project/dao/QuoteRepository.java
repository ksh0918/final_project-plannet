package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Quote;

public interface QuoteRepository extends JpaRepository<Quote, Integer> {
}