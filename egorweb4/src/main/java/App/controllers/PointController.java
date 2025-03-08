package App.controllers;

import App.domain.Coordinate;
import App.domain.Point;
import App.services.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("api/points")
@CrossOrigin(origins = "http://localhost:3000")
public class PointController {

    @Autowired
    private PointService pointService;


    @GetMapping()
    public List<Point> getAllPoints() {
        System.out.println("-------------------------------------------");
        return pointService.getAllPoints();
    }

    @PostMapping()
    public Point savePoint(@RequestBody Coordinate coordinate) {
        try {

            return pointService.savePoint(coordinate, ZonedDateTime.now(ZoneOffset.UTC));
        }
        catch (IllegalArgumentException e) {
            return null;
        }
    }

    @DeleteMapping()
    public void deletePoints() {
        try{
            pointService.deletePoints();
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
    }
}