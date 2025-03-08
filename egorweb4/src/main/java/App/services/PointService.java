package App.services;

import App.domain.Coordinate;
import App.domain.Point;
import App.repositories.PointsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class PointService {
    @Autowired
    private PointsRepository pointsRepository;

    public List<Point> getAllPoints(){
        return pointsRepository.findAll();
    }

    public void deletePoints(){
        pointsRepository.deleteAll();
    }

    public Point savePoint(Coordinate coordinate, ZonedDateTime time){
        try{
            System.out.println("saved");
            return pointsRepository.save(new Point(
                            coordinate,
                            checkHit(coordinate),
                            time
                    )
            );
        }
        catch(IllegalArgumentException e){
            throw new IllegalArgumentException(e);
        }
    }

    private boolean checkHit(Coordinate coord) {
        double x = coord.getX();
        double y = coord.getY();
        double r = coord.getR();

        if (x <= 0 && y <= 0) {
            return x >= -r && y >= -r;
        }

        if (x >= 0 && y >= 0) {
            return y <= -x + r / 2;
        }

        if (x >= 0 && y <= 0) {
            return (x * x + y * y <= (r / 2) * (r / 2));
        }

        return false;
    }

    private void validateCord(Coordinate cord) throws IllegalArgumentException {
        if(cord == null || cord.getR() < -3 || cord.getR() > 5){
            throw new IllegalArgumentException("Invalid coordinate");
        }
    }
}
