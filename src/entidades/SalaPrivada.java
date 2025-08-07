package entidades;

public class SalaPrivada extends Espaco {
    private static final long serialVersionUID = 1L;

    public SalaPrivada(String id, String nome, double valorHora) {
        super(id, nome, valorHora);
    }

    @Override
    public String getTipo() {
        return "Sala Privada";
    }

    @Override
    public String getDescricaoCompleta() {
        return "Sala Privada: " + getNome() + " (ID: " + getId() + ") - Valor/Hora: R$" + String.format("%.2f", getValorHora());
    }
}
