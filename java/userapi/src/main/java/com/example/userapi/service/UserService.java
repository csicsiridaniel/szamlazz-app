package com.example.userapi.service;


import com.example.userapi.model.User;
import jakarta.validation.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final Map<Long, User> users = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final Validator validator;

    public UserService() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
        addSampleUsers();
    }

    private void addSampleUsers() {
        addUser("Mária", "Kovács", "Budapest, Váci út 1", "06101234567", true, User.Job.PEK);
        addUser("Béla", "Szabó", "Debrecen, Piac utca 45", "06301234567", false, User.Job.HENTES);
        addUser("Csilla", "Nagy", "Szeged, Kossuth tér 5", "06201234567", true, User.Job.KERTESZ);
        addUser("Dávid", "Kis", "Pécs, Király utca 7", "06701234567", true, User.Job.PEK);
        addUser("Erika", "Fehér", "Győr, Baross utca 13", "06801234567", false, User.Job.HENTES);
        addUser("Ferenc", "Varga", "Miskolc, Széchenyi u. 88", "06901234567", true, User.Job.KERTESZ);
        addUser("József", "Tóth", "Eger, Dobó tér 10", "06501234567", true, User.Job.HENTES);
    }

    private void addUser(String firstname, String lastname, String address,
                         String telephone, boolean active, User.Job job) {
        User user = new User();
        user.setId(idGenerator.getAndIncrement());
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setAddress(address);
        user.setTelephone(telephone);
        user.setActive(active);
        user.setJob(job);

        validateUser(user);

        users.put(user.getId(), user);
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    public Optional<User> getUserById(Long id) {
        return Optional.ofNullable(users.get(id));
    }

    public User createUser(User user) {
        user.setId(idGenerator.getAndIncrement());
        validateUser(user);
        users.put(user.getId(), user);
        return user;
    }

    public Optional<User> updateUser(Long id, User updatedUser) {
        if (!users.containsKey(id)) return Optional.empty();
        updatedUser.setId(id);
        validateUser(updatedUser);
        users.put(id, updatedUser);
        return Optional.of(updatedUser);
    }

    public boolean deleteUser(Long id) {
        return users.remove(id) != null;
    }

    private void validateUser(User user) {
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            String errors = violations.stream()
                    .map(v -> v.getPropertyPath() + " " + v.getMessage())
                    .collect(Collectors.joining(", "));
            throw new ConstraintViolationException("User validation failed: " + errors, violations);
        }
    }
}
