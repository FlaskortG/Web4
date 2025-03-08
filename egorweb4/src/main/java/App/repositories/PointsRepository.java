package App.repositories;

import App.domain.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PointsRepository extends JpaRepository<Point, Long> {
    Optional<Point> findById(Long id);
}