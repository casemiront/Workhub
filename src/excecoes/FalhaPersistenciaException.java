package excecoes;

public class FalhaPersistenciaException extends Exception {
    private static final long serialVersionUID = 1L;

    public FalhaPersistenciaException(String message) {
        super(message);
    }

    public FalhaPersistenciaException(String message, Throwable cause) {
        super(message, cause);
    }
}
